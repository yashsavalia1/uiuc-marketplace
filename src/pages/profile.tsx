import Navbar from "@/components/Navbar"
import { Card } from "@/components/ui/card";
import { getImageURL, usePocketBase } from "@/lib/pb";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const pb = usePocketBase();
  const navigate = useNavigate();

  if (!pb.authStore.isValid || pb.authStore.model == null) {
    navigate("/sign-in");
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <Card className="p-5 space-y-2">
          <div>
            <span className="font-medium">Name:</span>
            <span className="ml-2">{pb.authStore.model?.name}</span>
          </div>

          <div>
            <span className="font-medium">Username:</span>
            <span className="ml-2">{pb.authStore.model?.username}</span>
          </div>

          <div>
            <span className="font-medium">Email:</span>
            <span className="ml-2">{pb.authStore.model?.email}</span>
          </div>
          <div className="flex items-center gap-4 pt-3">
            <span className="font-medium">Profile Picture:</span>
            <div className="w-24 h-24">
              <img
                src={getImageURL(pb.authStore.model, pb.authStore.model?.avatar, "thumb=200x200")}
                alt={pb.authStore.model?.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}