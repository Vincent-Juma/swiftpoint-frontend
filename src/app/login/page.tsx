export default function Login() {
    return (
      <section className="p-8 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-blue-600">Login</h1>
        <form className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
          />
          <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>
      </section>
    )
  }
  