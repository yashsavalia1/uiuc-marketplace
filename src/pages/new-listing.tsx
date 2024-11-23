import { usePocketBase } from "@/lib/pb";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { Listing } from "@/types/Listing";
import { Tag, TagInput } from 'emblor';
import { tagInputStyles } from "@/lib/utils";


export default function NewListing() {
  const pb = usePocketBase();
  const navigate = useNavigate();

  if (!pb.authStore.isValid || pb.authStore.model == null) {
    navigate("/sign-in");
  }

  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);

    const data = {
      title,
      description,
      price,
      "lister": pb.authStore.model?.id,
      images,
      tags: tags.map(tag => tag.text)
    };

    try {
      const listing = await pb.collection('listings').create<Listing>(data);

      // TODO: create listing page
      navigate(`/listing?id=${listing.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create A New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter listing title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter listing description"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <div className="flex items-stretch">
                  <Card className="place-content-center px-1.5 rounded-r-none bg-gray-100">$</Card>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    min={0}
                    step={0.01}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <TagInput tags={tags}
                  styleClasses={tagInputStyles}
                  setTags={newTags => setTags(newTags)}
                  placeholder="Add a tag"
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image" className="block mb-2">Images</Label>
              <Card className="p-4">
                <FileUploader id="images" onValueChange={(files) => setImages(files)} maxFileCount={10} />
              </Card>

            </div>
          </div>
          <Button type="submit" className="float-right">Create Listing</Button>
        </form>
      </div>
    </>
  )
}
