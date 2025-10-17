'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import ErrorMessage from '@/components/ErrorMessage';

async function getItem(id: string) {
  try {
    const res = await fetch(`/api/items/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itemId, setItemId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    description: '',
    link: '',
    thumb: '',
    lg_img: '',
    price: '',
    categories: '',
    subcategory: '',
  });

  useEffect(() => {
    async function loadItem() {
      const resolvedParams = await params;
      setItemId(resolvedParams.id);
      const item = await getItem(resolvedParams.id);

      if (item) {
        setFormData({
          name: item.name || '',
          short_name: item.short_name || '',
          description: item.description || '',
          link: item.link || '',
          thumb: item.thumb || '',
          lg_img: item.lg_img || '',
          price: item.price || '',
          categories: item.categories || '',
          subcategory: item.subcategory || '',
        });
      }
    }

    loadItem();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update item');
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Edit Item</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <ErrorMessage message={error} title="Failed to Update Item" />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                  Item Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="short_name" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                  Short Name
                </label>
                <input
                  id="short_name"
                  name="short_name"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
                  value={formData.short_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="$1,000"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                  Buy Link
                </label>
                <input
                  id="link"
                  name="link"
                  type="url"
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
                  value={formData.link}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                  Category
                </label>
                <input
                  id="categories"
                  name="categories"
                  type="text"
                  placeholder="TECH, VICES, etc."
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black uppercase text-black"
                  value={formData.categories}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                  Subcategory
                </label>
                <input
                  id="subcategory"
                  name="subcategory"
                  type="text"
                  placeholder="GADGETS, etc."
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
                  value={formData.subcategory}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                type="thumb"
                currentImage={formData.thumb}
                onUploadComplete={(url) => setFormData({ ...formData, thumb: url })}
                label="Thumbnail Image"
              />

              <ImageUpload
                type="lg"
                currentImage={formData.lg_img}
                onUploadComplete={(url) => setFormData({ ...formData, lg_img: url })}
                label="Large Image"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-4 font-medium tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 uppercase text-sm"
              >
                {loading ? 'Updating...' : 'Update Item'}
              </button>
              <Link
                href="/admin"
                className="flex-1 bg-gray-200 text-black py-4 font-medium tracking-wider hover:bg-gray-300 transition-colors uppercase text-sm text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
