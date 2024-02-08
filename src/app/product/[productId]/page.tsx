import AddToCartButton from '@/components/AddToCartButton'
import ImageSlider from '@/components/ImageSlider'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'
import { getPayloadClient } from '@/get-payload'
import { formatPrice } from '@/lib/utils'
import { Check, Shield } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    productId: string
  }
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' },
]

const Page = async ({ params }: PageProps) => {

/*   const [quantity, setQuantity] = new useState<number>(1)
 */
  const { productId } = params

  const payload = await getPayloadClient()

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: 'approved',
      },
    },
  })

  const [product] = products

  if (!product) return notFound()

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label

  const validUrls = product.images
    .map(({ image }) =>
      typeof image === 'string' ? image : image.url
    )
    .filter(Boolean) as string[]

  return (
    <MaxWidthWrapper className='bg-white'>
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-8 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          
          {/* Product images */}
          <div className='mt-10 lg:col-start-1 lg:row-span-2 lg:mt-0 lg:self-center'>
            <div className='aspect-square rounded-lg'>
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* Product Details */}
          <div className='lg:max-w-lg lg:self-end'>
            <ol className='flex items-center space-x-2'>
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className='flex items-center text-sm'>
                    <Link
                      href={breadcrumb.href}
                      className='font-medium text-sm text-muted-foreground hover:text-gray-900'>
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                        className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'>
                        <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className='mt-4'>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                {product.name}<> </>{product.size?product.size:null}
              </h1>
            </div>

            <section className='mt-4'>
              <div className='flex items-center'>
                <p className='font-medium text-xl text-gray-900'>
                  {formatPrice(product.price) + " "}
                  {product.mrp ? <><span className='font-light text-sm'>/<s>{formatPrice(product.mrp)}</s></span>&nbsp;<span className="text-lg font-medium bg-yellow-500 px-2">{Math.floor(((product.mrp-product.price)*100)/product.mrp)}% Off</span></>:""}
                </p>

                <div className='ml-4 border-l text-muted-foreground border-gray-300 pl-4'>
                  {label}
                </div>
              </div>

              <div className='mt-4 space-y-2'>
                <h3 className="font-medium">Description</h3>
                <pre className='text-base text-muted-foreground whitespace-pre-wrap'>
                  {product.description}
                </pre>
                {product.size ? <div className="flex space-x-2 items-center">
                  <div className="font-medium">Size: </div>
                  <div>{product.size}</div>
                </div>:null}
                <div className="flex space-x-2 items-center">
                  <div className="font-medium">Material: </div>
                  <div>Pure Cotton</div>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="font-medium">Care: </div>
                  <div>Easy to wash and maintain</div>
                </div>
              </div>
              <div className='mt-6 flex items-center'>
                <Check
                  aria-hidden='true'
                  className='h-5 w-5 flex-shrink-0 text-green-500'
                />
                <p className='ml-2 text-sm text-muted-foreground'>
                  Eligible for instant dispatch.
                </p>
              </div>
            </section>
          </div>

          {/* add to cart part */}
          <div className='mt-10 lg:col-start-2 lg:row-start-2 lg:max-w-lg lg:self-start'>
            <div>
              <div className='mt-10 flex justify-center items-center'>
                <AddToCartButton product={product} />
              </div>
              <div className='mt-6 text-center'>
                <div className='group inline-flex text-sm text-medium'>
                  <Shield
                    aria-hidden='true'
                    className='mr-2 h-5 w-5 flex-shrink-0 text-gray-400'
                  />
                  <span className='text-muted-foreground hover:text-gray-700'>
                    Genuine Product Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        href='/products'
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} just like '${product.name}'`}
      />
    </MaxWidthWrapper>
  )
}

export default Page