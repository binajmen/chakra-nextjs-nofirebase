import { Action, action, Thunk, thunk, ActionOn, actionOn } from 'easy-peasy'

import firebase from '../firebase/client'
import { generateId } from '../utils'
import type { Order, Category, Categories } from '../types/category'

import type { StoreModel } from './index'

type State = {
    order: Order
    list: Categories
}

const state: State = {
    order: [],
    list: {}
}

type ReplacePayload = { categoryId: string, category: Category }
type SwitchPayload = { categoryId: string, available: boolean }
type AddPayload = { categoryId: string, productId: string }
type RemovePayload = { categoryId: string, productId: string }

type ReadPayload = { vendorId: string, categoryId: string }
type CreatePayload = { vendorId: string, category: Category }
type UpdatePayload = { vendorId: string, categoryId: string, category: Category }
type DeletePayload = { vendorId: string, categoryId: string }
type OrderPayload = { vendorId: string, newOrder: Order }
type AvailabilityPayload = { vendorId: string, categoryId: string, available: boolean }

type Model = State & {
    setOrder: Action<Model, Order>
    // onCategory: ActionOn<Model, ReplacePayload>
    setList: Action<Model, Categories>
    replaceCategory: Action<Model, ReplacePayload>
    removeCategory: Action<Model, string>
    switchAvailability: Action<Model, SwitchPayload>
    addProduct: Action<Model, AddPayload>
    removeProduct: Action<Model, RemovePayload>

    getCategory: Thunk<Model, ReadPayload, {}, StoreModel>
    getCategories: Thunk<Model, string, {}, StoreModel>
    createCategory: Thunk<Model, CreatePayload, {}, StoreModel>
    updateCategory: Thunk<Model, UpdatePayload, {}, StoreModel>
    deleteCategory: Thunk<Model, DeletePayload, {}, StoreModel>
    updateOrder: Thunk<Model, OrderPayload, {}, StoreModel>
    updateAvailability: Thunk<Model, AvailabilityPayload, {}, StoreModel>
}

const model: Model = {
    ...state,

    // ACTIONS

    setOrder: action((state, newOrder) => {
        state.order = newOrder
    }),

    // onCategory: actionOn(
    //     actions => actions.replaceCategory,
    //     (state, target) => {
    //         state.order.push(target.payload.categoryId)
    //         // avoid duplicate
    //         state.order = state.order.filter((item, index) => state.order.indexOf(item) === index)
    //     }
    // ),

    setList: action((state, newList) => {
        state.list = { ...state.list, ...newList }
    }),

    replaceCategory: action((state, { categoryId, category }) => {
        state.list[categoryId] = category
    }),

    removeCategory: action((state, categoryId) => {
        delete state.list[categoryId]
    }),

    switchAvailability: action((state, { categoryId, available }) => {
        state.list[categoryId].available = available
    }),

    addProduct: action((state, { categoryId, productId }) => {
        if (categoryId in state.list && !state.list[categoryId].items.includes(productId)) {
            state.list[categoryId].items.push(productId)
        }
    }),

    removeProduct: action((state, { categoryId, productId }) => {
        if (categoryId in state.list) {
            state.list[categoryId].items = state.list[categoryId].items.filter(id => id !== productId)
        }
    }),

    // THUNKS

    getCategory: thunk(async (actions, { vendorId, categoryId }, helpers) => {
        try {
            const doc = await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories').doc(categoryId)
                .get()

            if (!doc.exists) throw new Error('no-categories')

            let docs: Categories = { [categoryId]: doc.data() as Category }

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

    getCategories: thunk(async (actions, vendorId, helpers) => {
        try {
            const snapshot = await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories')
                .get()

            if (snapshot.empty) throw new Error('no-categories')

            let order: Order = []
            let docs: Categories = {}

            snapshot.forEach((doc) => {
                if (doc.id === '_meta_') order = doc.data().order
                else docs[doc.id] = doc.data() as Category
            })

            if (order.length === 0) throw new Error('missing-meta-order')

            actions.setList(docs)
            actions.setOrder(order)
        } catch (error) {
            const { getStoreActions } = helpers

            console.error(error)
            getStoreActions().ui.toast({
                message: error.message,
                status: "error"
            })
        }
    }),

    createCategory: thunk(async (actions, { vendorId, category }, helpers) => {
        const { getStoreActions } = helpers
        try {
            const { getState } = helpers

            const categoryId = generateId(category.name!) // TOFIX: define name as required

            let order = [...getState().order]
            order.push(categoryId)
            // avoid duplicate
            order = order.filter((item, index) => order.indexOf(item) === index)

            let batch = firebase.firestore().batch()

            const categoryRef = firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories').doc(categoryId)
            batch.set(categoryRef, category)

            const metaRef = firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories').doc('_meta_')
            batch.update(metaRef, { order })

            await batch.commit()

            actions.replaceCategory({ categoryId, category })
            actions.setOrder(order)

            getStoreActions().ui.toast({
                message: "vendor:changes-saved",
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

    updateCategory: thunk(async (actions, { vendorId, categoryId, category }, helpers) => {
        const { getStoreActions } = helpers
        try {
            await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories').doc(categoryId)
                .update(category)

            actions.replaceCategory({ categoryId, category })

            getStoreActions().ui.toast({
                message: "vendor:changes-saved",
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

    deleteCategory: thunk(async (actions, { vendorId, categoryId }, helpers) => {
        const { getStoreActions } = helpers
        try {
            const { getState } = helpers

            let batch = firebase.firestore().batch()

            const categoryRef = firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories').doc(categoryId)
            batch.delete(categoryRef)

            const order = getState().order.filter(id => id !== categoryId)
            const metaRef = firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories').doc('_meta_')
            batch.update(metaRef, { order })

            await batch.commit()

            actions.setOrder(order)
            actions.removeCategory(categoryId)

            getStoreActions().ui.toast({
                message: "vendor:changes-saved",
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

    updateOrder: thunk(async (actions, { vendorId, newOrder }, helpers) => {
        const { getStoreActions } = helpers
        try {
            await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories').doc('_meta_')
                .update({ order: newOrder })

            actions.setOrder(newOrder)

            getStoreActions().ui.toast({
                message: "vendor:changes-saved",
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

    updateAvailability: thunk(async (actions, { vendorId, categoryId, available }, helpers) => {
        const { getStoreActions } = helpers
        try {
            await firebase.firestore()
                .collection('vendors').doc(vendorId)
                .collection('categories').doc(categoryId)
                .update({ available: available })

            actions.switchAvailability({ categoryId, available })

            getStoreActions().ui.toast({
                message: "vendor:changes-saved",
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