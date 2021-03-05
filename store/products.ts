import { Action, action, Thunk, thunk } from 'easy-peasy'

import firebase from '@/lib/firebase/client'
import { generateId } from '@/utils/index'
import type { Product, Products } from '@/types/product'

import type { StoreModel } from './index'

type State = {
    list: Products
}

const state: State = {
    list: {}
}

type ReplacePayload = { productId: string, product: Product }
type SwitchPayload = { productId: string, available: boolean }

type ReadCategoryPayload = { vendorId: string, categoryId: string }
type CreatePayload = { vendorId: string, categoryId?: string, product: Product }
type UpdatePayload = { vendorId: string, productId: string, product: Product }
type DeletePayload = { vendorId: string, productId: string }
type AvailabilityPayload = { vendorId: string, productId: string, available: boolean }

type Model = State & {
    setList: Action<Model, Products>

    replaceProduct: Action<Model, ReplacePayload>
    removeProduct: Action<Model, string>
    switchAvailability: Action<Model, SwitchPayload>

    getProductsInCategory: Thunk<Model, ReadCategoryPayload, {}, StoreModel>
    createProduct: Thunk<Model, CreatePayload, {}, StoreModel>
    updateProduct: Thunk<Model, UpdatePayload, {}, StoreModel>
    deleteProduct: Thunk<Model, DeletePayload, {}, StoreModel>
    updateAvailability: Thunk<Model, AvailabilityPayload, {}, StoreModel>
}

const model: Model = {
    ...state,

    // ACTIONS

    setList: action((state, newList) => {
        state.list = { ...state.list, ...newList }
    }),

    replaceProduct: action((state, { productId, product }) => {
        state.list[productId] = product
    }),

    removeProduct: action((state, productId) => {
        delete state.list[productId]
    }),

    switchAvailability: action((state, { productId, available }) => {
        state.list[productId].available = available
    }),

    // THUNKS

    getProductsInCategory: thunk(async (actions, { vendorId, categoryId }, helpers) => {
        try {
            const { getStoreState, getStoreActions } = helpers

            if (!(categoryId in getStoreState().categories.list)) {
                getStoreActions().categories.getCategory({ vendorId, categoryId })
            }

            const snapshot = await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('products')
                .where("categoryIds", "array-contains", categoryId)
                .get()

            if (snapshot.empty) throw new Error('no-products')

            let docs: Products = {}

            snapshot.forEach(doc => {
                docs[doc.id] = doc.data() as Product
            })

            actions.setList(docs)
        } catch (error) {
            const { getStoreActions } = helpers

            console.error(error)
            getStoreActions().ui.toast({
                message: error.message,
                status: "error"
            })
        }
    }),

    createProduct: thunk(async (actions, { vendorId, categoryId = "", product }, helpers) => {
        const { getStoreActions } = helpers
        try {
            const { getState } = helpers

            const productId = generateId(product.longName!) // TOFIX: define name as required
            const categoryIds = !!categoryId ? [categoryId] : []
            const finalProduct = { ...product, categoryIds }

            // create in firestore
            await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('products').doc(productId)
                .set(finalProduct, { merge: true })

            // create local copy
            actions.replaceProduct({ productId, product: finalProduct })

            // add to parent category (if any) in local
            // (+ trigger functions)
            getStoreActions().categories.addProduct({ categoryId, productId })

            getStoreActions().ui.toast({
                message: "manager:changes-saved",
                status: "success"
            })
        } catch (error) {
            console.error(error)

            getStoreActions().ui.toast({
                message: error.message,
                status: "error"
            })
        }
    }),

    updateProduct: thunk(async (actions, { vendorId, productId, product }, helpers) => {
        const { getStoreActions } = helpers
        try {
            // update in firestore
            await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('products').doc(productId)
                .update(product)

            // update in local
            actions.replaceProduct({ productId, product })

            getStoreActions().ui.toast({
                message: "manager:changes-saved",
                status: "success"
            })
        } catch (error) {
            console.error(error)

            getStoreActions().ui.toast({
                message: error.message,
                status: "error"
            })
        }
    }),

    deleteProduct: thunk(async (actions, { vendorId, productId }, helpers) => {
        const { getStoreActions } = helpers
        try {
            const { getState } = helpers

            let batch = firebase.firestore().batch()

            // delete product
            await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('products').doc(productId)
                .delete()

            // delete from parent category (if any) in local
            // TOFIX: TODO: (+ trigger functions)
            const categoryIds = getState().list[productId].categoryIds
            categoryIds.forEach(categoryId => {
                getStoreActions().categories.removeProduct({ categoryId, productId })
            })

            // delete in local
            actions.removeProduct(productId)

            getStoreActions().ui.toast({
                message: "manager:changes-saved",
                status: "success"
            })
        } catch (error) {
            console.error(error)

            getStoreActions().ui.toast({
                message: error.message,
                status: "error"
            })
        }
    }),

    updateAvailability: thunk(async (actions, { vendorId, productId, available }, helpers) => {
        const { getStoreActions } = helpers
        try {
            await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('products').doc(productId)
                .update({ available: available })

            actions.switchAvailability({ productId, available })

            getStoreActions().ui.toast({
                message: "manager:changes-saved",
                status: "success"
            })
        } catch (error) {
            console.error(error)

            getStoreActions().ui.toast({
                message: error.message,
                status: "error"
            })
        }
    }),
}

export type { State, Model }
export { state, model }