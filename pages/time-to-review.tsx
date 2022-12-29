import Layout from "../components/layout";
import LayoutWithNav from "../components/layout_with_nav";
import ReviewRequestWrapper from "../components/content/time-to-review/ReviewRequestWrapper";

export default function TeamPrs() {
  return (
    <Layout>
      <LayoutWithNav>
        <ReviewRequestWrapper />
      </LayoutWithNav>
    </Layout>
  );
}
