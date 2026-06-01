import ExpertProfileForm from "@/components/expert/expert-profile-form";

export default async function ExpertProfilePage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>
        <p className="text-muted-foreground">
          Update your expert profile details and availability.
        </p>
      </div>

      <ExpertProfileForm />
    </div>
  );
}
