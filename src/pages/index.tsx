import { useEffect, useState } from "react";
import { Listing } from "@/types/Listing";
import { getImageURL, usePocketBase } from "@/lib/pb";
import { LoadingSpinner } from "@/components/ui/spinner";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

export default function Home() {

  const pb = usePocketBase();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resultList = await pb.collection('listings').getList(1, 50, {
        sort: 'created',
        order: 'desc',
        expand: "lister",
      });

      setListings(resultList.items as Listing[]);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Navbar />
      <div className="m-5 space-y-4">
      <div className="relative flex-grow">
          <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for items..."
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Featured Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading &&
            <LoadingSpinner className="m-3 w-12 h-12" />}
          {listings.map((listing) => (
            <a href={`/listing?id=${listing.id}`} key={listing.id}>
              <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <img
                  src={getImageURL(listing, listing.images[0])}
                  alt={listing.title}
                  className="w-full sm:h-56 h-32 object-contain mb-2 rounded"
                />
                <h3 className="font-semibold truncate">{listing.title}</h3>
                <p className="text-gray-500">${listing.price}</p>
              </CardContent>
            </Card>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}