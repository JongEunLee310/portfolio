import { ButtonLink } from "@/components/common/ButtonLink";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLayout } from "@/components/layout/PageLayout";
import { PATHS } from "@/constants/paths";
import { pageChrome } from "@/utils/pageChrome";

export function NotFoundPage() {
  return (
    <PageLayout {...pageChrome}>
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <EmptyState
            title="페이지를 찾을 수 없습니다"
            description="요청한 경로가 없거나 아직 공개되지 않은 페이지입니다."
          />
          <div className="mt-6 flex justify-center">
            <ButtonLink href={PATHS.home}>홈으로 이동</ButtonLink>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
