import { useGetBooksQuery } from '../store/api/booksApi'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/reducers/cartSlice'
import Swal from 'sweetalert2'
import { Book } from '../types'

const Books = () => {
  const { data: books = [], isLoading, error } = useGetBooksQuery()
  const dispatch = useDispatch()

  const handleAddToCart = (book: any) => {
    dispatch(addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity: 1
    }))
    Swal.fire({
      title: 'Success!',
      text: 'Book added to cart',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  }

  if (isLoading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-600">Error loading books</div>

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Available Books</h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {books.map((book: Book) => (
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
                    <span aria-hidden="true" className="absolute inset-0" />
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${book.price}</p>
              </div>
              <button
                onClick={() => handleAddToCart(book)}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Books