import { CardListSkeleton, PageHeaderSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeaderSkeleton actions={0} />
      <CardListSkeleton count={3} />
    </div>
  );
}
