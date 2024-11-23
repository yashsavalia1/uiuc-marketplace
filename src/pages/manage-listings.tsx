import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getImageURL, usePocketBase } from "@/lib/pb";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Listing } from "@/types/Listing";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function ManageListings() {
  const pb = usePocketBase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!pb.authStore.isValid || pb.authStore.model == null) {
    navigate("/sign-in");
  }

  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resultList = await pb.collection('listings').getList(1, 50, {
        filter: `lister="${pb.authStore.model?.id}"`,
        sort: 'created',
        order: 'desc',
        expand: "lister",
      });

      setLoading(false);
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

  const handlePublish = async (id: string) => {
    const published = await pb.collection('listings').update(id, {
      published: !listings.filter(listing => listing.id === id)[0].published,
    });

    if (published) {
      setListings(listings.map(listing => {
        if (listing.id === id) {
          return {
            ...listing,
            published: !listing.published,
          };
        }
        return listing;
      }));
    } else {
      alert('Failed to publish listing');
    }
  }


  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">My Listings</h1>
        {loading &&
          <LoadingSpinner className="m-3 w-12 h-12" />}
        {listings.map((listing) => (
          <Card key={listing.id} className="flex flex-col sm:flex-row items-stretch p-4 gap-4 relative hover:shadow-lg transition-shadow">
            <Link to={`/listing?id=${listing.id}`} className="w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/12 flex-shrink-0">
              <img
                src={getImageURL(listing, listing.images[0], 'thumb=200x200')}
                alt={listing.title}
                className="w-full h-auto object-cover rounded-md"
              />
            </Link>

            <Link to={`/listing?id=${listing.id}`} className="flex-grow flex flex-col gap-2">
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <div className="text-gray-500">{listing.description}</div>
              <span className="font-bold text-lg">${listing.price}</span>
            </Link>

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
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" className="h-8 w-8" variant={listing.published ? "default" : "green"}>
                    {listing.published ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    <span className="sr-only">Published</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{listing.published ? "Unpublish" : "Publish"} Listing</h2>
                    <p>Would you like to {listing.published ? "unpublish" : "publish"} your listing for: {listing.title}?</p>
                    <div className="flex gap-4 mt-4">
                      <DialogClose asChild>
                        <Button onClick={() => handlePublish(listing.id)} variant={listing.published ? "destructive" : "green"}>{listing.published ? "Unpublish" : "Publish"}</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <span className="text-gray-500 text-sm flex items-center mt-auto">
              {listing.published ? "Published" : "Unpublished"}
            </span>
          </Card>
        ))}
      </div>
    </>
  );
}