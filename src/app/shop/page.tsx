export default function ShopPage() {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">SwiftPoint Shop</h1>
        <p className="mb-8">E-commerce fulfillment for SMEs and global customers. Products will appear here.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sample Product */}
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <img src="/sample-product.jpg" alt="Product" className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-4">Sample Product</h2>
            <p className="text-gray-600">KES 1,500</p>
            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    );
  }
  