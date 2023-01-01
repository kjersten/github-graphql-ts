import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import LayoutWithNav from "../../../components/LayoutWithNav";
import AuthorPulls from "../../../components/content/author/AuthorPulls";

export default function AuthorHistory() {
  const router = useRouter();
  let { slug } = router.query;
  if (Array.isArray(slug)) {
    slug = slug[0];
  }

  return (
    <Layout>
      <LayoutWithNav>
        <AuthorPulls slug={slug} />
      </LayoutWithNav>
    </Layout>
  );
}
