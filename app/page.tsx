import { HeroBanner } from "@/components/hero-banner";
import { HotProducts } from "@/components/hot-products";
import { Categories } from "@/components/categories";
import { FeaturedProducts } from "@/components/featured-products";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroBanner />
      <div className="container mx-auto px-4">
        <Categories />
        <HotProducts />
        {/* <FeaturedProducts /> */}
      </div>
    </div>
  );
}

// import { Categories } from "@/components/categories";
// import { FeaturedProducts } from "@/components/featured-products";
// import { HeroBanner } from "@/components/hero-banner";
// import { HotProducts } from "@/components/hot-products";
// import { motion } from "framer-motion";

// export default function HomePage() {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
//     >
//       {/* Hero Section */}
//       <HeroBanner />

//       {/* Main Content */}
//       <div className="relative">
//         {/* Background decorations */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 -left-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
//           <div className="absolute top-3/4 -right-20 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl" />
//         </div>

//         {/* Content Sections */}
//         <div className="relative z-10">
//           <Categories />
//           <HotProducts />
//           {/* <FeaturedProducts /> */}
//         </div>
//       </div>
//     </motion.div>
//   );
// }
