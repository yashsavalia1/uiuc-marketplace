import { useEffect, useState } from "react";
import { Listing } from "@/types/Listing";
import { getImageURL, usePocketBase } from "@/lib/pb";
import { LoadingSpinner } from "@/components/ui/spinner";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";

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
      <div className="m-5 flex gap-5">
        {loading &&
          <LoadingSpinner className="m-3 w-12 h-12" />}
        {listings.map((listing, index) => (
          <Card key={index} className="p-3 max-w-72">
            <h2 className="text-xl">{listing.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(listing.description) }}></div>
            <p>${listing.price}</p>
            <p>{listing.expand?.lister.name}</p>
            <img src={getImageURL(listing, listing.images[0])} alt={listing.title} className="w-60" />
          </Card>
        ))}
      </div>
    </>
  )
}