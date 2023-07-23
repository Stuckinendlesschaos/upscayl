import { useState } from 'react'

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' }
]

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <div>
      <div>
        <a href="/">返回首页</a>
      </div>
    </div>
  )
}
