import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import LayoutWithNav from "../../../components/LayoutWithNav";
import AuthorReviews from "../../../components/content/author/AuthorReviews";

export default function AuthorHistory() {
  const router = useRouter();
  let { slug } = router.query;
  if (Array.isArray(slug)) {
    slug = slug[0];
  }

  return (
    <Layout>
      <LayoutWithNav>
        <AuthorReviews slug={slug} />
      </LayoutWithNav>
    </Layout>
  );
}
