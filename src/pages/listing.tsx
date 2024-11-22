import { getImageURL, usePocketBase } from "@/lib/pb";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Listing as ListingModel } from "@/types/Listing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiDollarSign, FiMessageCircle } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import { LoadingSpinner } from "@/components/ui/spinner";


export default function Listing() {

  const [params] = useSearchParams();

  const id = useMemo(() => params.get("id"), [params]);

  const pb = usePocketBase();

  const [listing, setListing] = useState<ListingModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);


  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }


    (async () => {
      setLoading(true);
      const result = await pb.collection<ListingModel>('listings').getOne(id, {
        expand: "lister",
      }).catch(() => {
        setNotFound(true);
        return;
      }) ?? null;

      setListing(result);
      setLoading(false);

      // await pb.collection<ListingModel>('listings').update(id, {
      //   views: (result?.views ?? 0) + 1
      // });
    })();
  }, [id]);

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Listing not found</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        {loading && <LoadingSpinner className="m-3 w-12 h-12 mx-auto" />}
        {listing && <>
          <h1 className="text-3xl font-medium mb-6">{listing.title}</h1><div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Card className="relative h-96 object-contain py-4">
                <img
                  src={getImageURL(listing, listing.images[imgIndex])}
                  alt={`${listing.title} - Image ${imgIndex + 1}`}
                  className="rounded-lg object-contain h-full mx-auto"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80"
                  disabled={imgIndex === 0}
                  onClick={() => setImgIndex((prev) => prev - 1)}
                >
                  <FiChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80"
                  disabled={imgIndex === listing.images.length - 1}
                  onClick={() => setImgIndex((prev) => prev + 1)}
                >
                  <FiChevronRight className="h-4 w-4" />
                </Button>
              </Card>
              <div className="flex justify-center space-x-2">
                {listing.images.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === imgIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImgIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="p-4 space-y-6">
                <div>
                  {/* <h2 className="text-2xl font-semibold mb-2">Description</h2> */}
                  <p className="">{listing.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FiDollarSign className="h-5 w-5 mr-2" />
                    <span className="font-semibold">${listing.price}</span>
                  </div>
                  <div className="flex items-center">
                    {listing.condition}
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 mr-2" />
                    <span>{new Date(listing.created).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span>Sold by:</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-9 h-9 border-2 border-black">
                      <AvatarImage src={getImageURL(listing.expand?.lister, listing.expand?.lister.avatar, "thumb=100x100")} />
                      <AvatarFallback>{listing.expand?.lister.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{listing.expand?.lister.name}</span>
                  </div>
                </div>
              </Card>

              <div className="flex space-x-4">
                <Button className="flex-1">
                  <FiMessageCircle className="h-5 w-5 mr-2" />
                  Contact Seller
                </Button>
              </div>
            </div>
          </div><div className="mt-12">
            <h2 className="text-2xl font-medium mb-4">Related Listings</h2>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
{relatedListings.map((item) => (
  <Card key={item.id}>
    <CardContent className="p-4">
      <img
        src={item.image}
        alt={item.title}
        width={100}
        height={100}
        className="w-full h-32 object-cover mb-2 rounded"
      />
      <h3 className="font-semibold truncate">{item.title}</h3>
      <p className="">${item.price}</p>
    </CardContent>
  </Card>
))}
</div> */}
          </div>
        </>}
      </div>
    </>
  )
}