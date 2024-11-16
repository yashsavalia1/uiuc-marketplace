import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getImageURL, usePocketBase } from "@/lib/pb";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Listing } from "@/types/Listing";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function ManageListings() {
  const pb = usePocketBase();
  const navigate = useNavigate();

  if (!pb.authStore.isValid || pb.authStore.model == null) {
    navigate("/sign-in");
  }

  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    (async () => {
      const resultList = await pb.collection('listings').getList(1, 50, {
        filter: `lister="${pb.authStore.model?.id}"`,
        sort: 'created',
        order: 'desc',
        expand: "lister",
      });

      setListings(resultList.items as Listing[]);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    const deleted = await pb.collection('listings').delete(id);
    if (deleted) {
      setListings(listings.filter(listing => listing.id !== id));
    } else {
      alert('Failed to delete listing');
    }
  }


  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">My Listings</h1>
        {listings.map((listing) => (
          <Card key={listing.id} className="flex flex-col sm:flex-row items-stretch p-4 gap-4 relative">
            <div className="w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/12 flex-shrink-0">
              <img
                src={getImageURL(listing, listing.images[0], 'thumb=200x200')}
                alt={listing.title}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>

            <div className="flex-grow flex flex-col gap-2">
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <div className="text-gray-500">{listing.description}</div>
              <span className="font-bold text-lg">${listing.price}</span>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button size="icon" className="h-8 w-8">
                <FiEdit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" className="h-8 w-8" variant="destructive">
                    <FiTrash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">Delete Listing</h2>
                    <p>Are you sure you want to delete this listing?</p>
                    <div className="flex gap-4 mt-4">
                      <Button onClick={() => handleDelete(listing.id)} variant="destructive">Delete</Button>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <span className="text-gray-500 text-sm flex items-center mt-auto">
              <FiEye className="w-4 h-4 mr-1" />
              {listing.views} views
            </span>
          </Card>
        ))}
      </div>
    </>
  );
}