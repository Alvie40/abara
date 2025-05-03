import { Link } from 'react-router-dom'
import { useGetBooksQuery } from '../store/api/booksApi'

const Home = () => {
  const { data: books = [], isLoading } = useGetBooksQuery()
  const featuredBooks = books.slice(0, 4) // Show first 4 books as featured

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to Book Store</span>
              <span className="block text-blue-600">Find Your Next Read</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover the best books online. Browse our collection and find your next favorite book.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/books"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Featured Books</h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {isLoading ? (
            <div className="col-span-4 text-center py-12">Loading...</div>
          ) : (
            featuredBooks.map((book) => (
              <div key={book.id} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/books/${book.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {book.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${book.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Home