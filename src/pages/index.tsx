import { useEffect, useState } from "react";
import { Listing } from "@/types/Listing";
import { getImageURL, usePocketBase } from "@/lib/pb";
import { LoadingSpinner } from "@/components/ui/spinner";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {

  const pb = usePocketBase();
  const navigate = useNavigate();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resultList = await pb.collection('listings').getList(1, 50, {
        filter: 'published=true',
        sort: 'created',
        order: 'desc',
        expand: "lister",
      });

      setListings(resultList.items as Listing[]);
      setLoading(false);
    })();
  }, []);

  const searchListings = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  }

  return (
    <>
      <Navbar />
      <div className="m-5 space-y-4">
      <form className="relative flex-grow" onSubmit={searchListings}>
          <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </form>
        <h2 className="text-2xl font-semibold mb-4">Featured Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading &&
            <LoadingSpinner className="m-3 w-12 h-12" />}
          {listings.map((listing) => (
            <Link to={`/listing?id=${listing.id}`} key={listing.id}>
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
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}