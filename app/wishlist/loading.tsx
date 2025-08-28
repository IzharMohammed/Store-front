export default function CartLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-4 text-lg text-muted-foreground">
            Loading your wishlist...
          </span>
        </div>
      </div>
    </div>
  );
}
