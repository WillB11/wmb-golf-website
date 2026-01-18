export interface Product {
  id: number
  name: string
  brand: string
  price: string
  priceNumber: number
  image: string
  design: string
  description: string
  category: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Engraved Vokey SM10 Wedge - 56°",
    brand: "Titleist",
    price: "£165",
    priceNumber: 165,
    image: "/laser-engraved-titleist-vokey-sm10-wedge-golf-club.jpg",
    design: "Classic Logo Design",
    description:
      "Precision laser engraved Titleist Vokey SM10 wedge featuring a classic logo design. This 56° wedge offers exceptional spin and control with custom personalisation.",
    category: "Wedges",
  },
  {
    id: 2,
    name: "Custom Titleist T200 Iron Set (5-PW)",
    brand: "Titleist",
    price: "£850",
    priceNumber: 850,
    image: "/laser-engraved-titleist-t200-iron-set-golf-clubs.jpg",
    design: "Minimal Line Pattern",
    description:
      "Complete set of laser engraved Titleist T200 irons from 5-PW. Each club features a minimal line pattern engraved with precision for a sleek, modern look.",
    category: "Irons",
  },
  {
    id: 3,
    name: "Engraved Ball Marker Set (3-Pack)",
    brand: "WMB Golf Co.",
    price: "£28",
    priceNumber: 28,
    image: "/laser-engraved-golf-ball-markers-set-premium.jpg",
    design: "Custom Initials",
    description:
      "Set of three premium laser engraved ball markers featuring custom initials. Perfect for gifts or personal use on the course.",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Scotty Cameron Newport 2 Putter",
    brand: "Titleist",
    price: "£420",
    priceNumber: 420,
    image: "/laser-engraved-scotty-cameron-newport-putter-golf.jpg",
    design: "Precision Line Work",
    description:
      "Exquisitely engraved Scotty Cameron Newport 2 putter with precision line work. A collector's piece that performs as good as it looks.",
    category: "Putters",
  },
  {
    id: 5,
    name: "Engraved Callaway Jaws Wedge - 60°",
    brand: "Callaway",
    price: "£145",
    priceNumber: 145,
    image: "/laser-engraved-callaway-jaws-wedge-golf-club.jpg",
    design: "Bold Script Text",
    description:
      "Callaway Jaws 60° lob wedge with bold script text engraving. Maximum spin meets custom personalisation.",
    category: "Wedges",
  },
  {
    id: 6,
    name: "Custom Divot Tool",
    brand: "WMB Golf Co.",
    price: "£22",
    priceNumber: 22,
    image: "/laser-engraved-golf-divot-tool-premium-metal.jpg",
    design: "Monogram Design",
    description:
      "Premium metal divot tool with laser engraved monogram design. Durable and elegant, perfect for any golfer.",
    category: "Accessories",
  },
  {
    id: 7,
    name: "TaylorMade MG4 Wedge - 54°",
    brand: "TaylorMade",
    price: "£155",
    priceNumber: 155,
    image: "/laser-engraved-taylormade-mg4-wedge-golf-club.jpg",
    design: "Geometric Pattern",
    description:
      "TaylorMade MG4 54° wedge featuring an intricate geometric pattern engraving. Stand out on the course with this unique design.",
    category: "Wedges",
  },
  {
    id: 8,
    name: "Ping i230 Iron Set (4-PW)",
    brand: "Ping",
    price: "£920",
    priceNumber: 920,
    image: "/laser-engraved-ping-i230-iron-set-golf-clubs.jpg",
    design: "Clean Typography",
    description:
      "Full set of Ping i230 irons (4-PW) with clean typography engraving. Premium performance meets personalised style.",
    category: "Irons",
  },
]

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}
