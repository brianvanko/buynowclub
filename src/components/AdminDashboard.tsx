'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminDashboardProps {
  items: any[];
}

export default function AdminDashboard({ items: initialItems }: AdminDashboardProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item._id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      return;
    }

    setDeleting(true);
    try {
      const deletePromises = selectedItems.map((id) =>
        fetch(`/api/items/${id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);

      // Remove deleted items from state
      setItems(items.filter((item) => !selectedItems.includes(item._id)));
      setSelectedItems([]);

      router.refresh();
    } catch (error) {
      alert('Error deleting items');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold uppercase tracking-tight">Admin Dashboard</h1>
            <div className="flex gap-4">
              {selectedItems.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={deleting}
                  className="bg-red-600 text-white px-6 py-3 font-medium tracking-wider hover:bg-red-700 transition-colors uppercase text-sm disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : `Delete ${selectedItems.length} Selected`}
                </button>
              )}
              <Link
                href="/admin/items/new"
                className="bg-white text-black px-6 py-3 font-medium tracking-wider hover:bg-gray-200 transition-colors uppercase text-sm"
              >
                + New Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === items.length && items.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      No items found. Create your first item!
                    </td>
                  </tr>
                ) : (
                  items.map((item: any) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleSelectItem(item._id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          {item.thumb && (
                            <img
                              src={item.thumb}
                              alt={item.name}
                              className="w-20 h-20 object-cover border border-gray-200"
                            />
                          )}
                          <div className="space-y-1 text-sm">
                            <p className="font-bold text-black">{item.name}</p>
                            <p className="text-gray-600">ID: {item._id}</p>
                            {item.price && <p className="text-gray-600">Price: {item.price}</p>}
                            {item.categories && (
                              <p className="text-gray-600">Category: {item.categories}</p>
                            )}
                            {item.subcategory && (
                              <p className="text-gray-600">Subcategory: {item.subcategory}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Link
                            href={`/items/${item._id}`}
                            className="text-gray-600 hover:text-black underline text-sm"
                            target="_blank"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/items/${item._id}/edit`}
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/admin/items/${item._id}/delete`}
                            className="text-red-600 hover:text-red-800 underline text-sm"
                          >
                            Delete
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-black underline decoration-2 underline-offset-4"
          >
            ← Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
