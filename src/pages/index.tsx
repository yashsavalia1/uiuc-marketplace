import { useEffect, useState } from "react";
import { Listing } from "@/types/Listing";
import { getImageURL, usePocketBase } from "@/lib/pb";
import { LoadingSpinner } from "@/components/ui/spinner";
import DOMPurify from "dompurify";

export default function Home() {

  const pb = usePocketBase();

  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    (async () => {
      const resultList = await pb.collection('listings').getList(1, 50, {
        sort: 'created',
        order: 'desc',
        expand: "lister",
      });

      setListings(resultList.items as Listing[]);
    })();
  }, []);

  return (
    <div className="m-3">
      <h1 className="text-3xl">UIUC Marketplace</h1>
      {!listings.length &&
        <LoadingSpinner className="m-3 w-12 h-12"/>
      }
      {listings.map((listing, index) => (
        <div key={index} className="border p-3 my-3 max-w-72">
          <h2 className="text-xl">{listing.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(listing.description) }}></div>
          <p>${listing.price}</p>
          <p>{listing.expand?.lister.name}</p>
          <img src={getImageURL(listing, listing.images[0])} alt={listing.title} className="w-60" />
        </div>
      ))}
    </div>
  )
}