import Layout from "../components/Layout";
import LayoutWithNav from "../components/LayoutWithNav";
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
