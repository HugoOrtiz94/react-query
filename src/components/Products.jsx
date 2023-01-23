import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getProducts, deletProduct, updateProduct } from '../api/productsAPI'

function Products() {

  const queryClient = useQueryClient()
  const { isLoading, data: products, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: products => products.sort((a, b) => b.id - a.id)
  })

  const deletProductMutation = useMutation({
    mutationFn: deletProduct,
    onSuccess: () => {
      queryClient.invalidateQueries('products')
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries('products')
    }
  })

  if (isLoading) return <div>loading...</div>
  else if (isError) return <div>{error.message}</div>

  return products.map(product => (
    <div key={product.id}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <button onClick={() => {
        deletProductMutation.mutate(product.id)
      }}>
        Delete
      </button>
      <input type="checkbox"
        checked={product.inStock}
        id={product.id}
        onChange={e => {
          updateProductMutation.mutate({
            ...product,
            inStock: e.target.checked
          })
        }} />
      <label htmlFor={product.id}>In Stock</label>
    </div>
  ))
}

export default Products