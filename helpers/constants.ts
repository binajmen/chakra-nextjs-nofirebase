// product tags
export const TAGS = [
  "bio",
  "vegan",
  "vegetarian",
  "alcool",
  "noalcool",
  "nogluten",
  "nosugar",
  "nopeanut",
  "fairtrade"
]

// week days
export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
export const FULLDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

// methods
export const COLLECT = "collect"
export const DELIVERY = "delivery"
export const METHODS = [COLLECT, DELIVERY]

// payment status
export const PAID = "paid"
export const UNPAID = "unpaid"

// order status
export const PAYMENT = "payment"
export const VALID = "valid"
export const ACCEPTED = "accepted"
export const PLANNED = "planned"
export const ONGOING = "ongoing"
export const READY = "ready"
export const COMPLETED = "completed"

export const ORDERSTATUS = [VALID, ACCEPTED, PLANNED, ONGOING, READY, COMPLETED]

// delivery status
export const TOPLACE = "toplace"
export const TOCLIENT = "toclient"
export const DELIVERED = "delivered"

export const DELIVERYSTATUS = [TOPLACE, TOCLIENT, DELIVERED]

// exception status
export const REJECTED = "rejected"
export const CANCELLED = "cancelled"
export const REFUNDED = "refunded"
export const ISSUE = "issue"


// const postcodes: { [index: string]: string } = {
//   1000: "Bruxelles / Brussel",
//   1020: "Laeken / Laken",
//   1030: "Schaarbeek / Schaerbeek",
//   1040: "Etterbeek",
//   1050: "Ixelles / Elsene",
//   1060: "Saint-Gilles / Sint-Gillis",
//   1070: "Anderlecht",
//   1080: "Molenbeek-Saint-Jean / Sint-Jans-Molenbeek",
//   1081: "Koekelberg",
//   1082: "Berchem-Sainte-Agathe / Sint-Agatha-Berchem",
//   1083: "Ganshoren",
//   1090: "Jette",
//   1120: "Neder-Over-Heembeek",
//   1130: "Haeren / Haren",
//   1140: "Evere",
//   1150: "Woluwe-Saint-Pierre / Sint-Pieters-Woluwe",
//   1160: "Auderghem / Oudergem",
//   1170: "Watermael-Boitsfort / Watermaal-Bosvoorde",
//   1180: "Uccle / Ukkel",
//   1190: "Forest / Vorst",
//   1200: "Woluwe-Saint-Lambert / Sint-Lambrechts-Woluwe",
//   1210: "Saint-Josse-ten-Noode / Sint-Joost-ten-Node"
// }