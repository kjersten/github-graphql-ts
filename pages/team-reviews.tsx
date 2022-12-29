import Layout from "../components/layout";
import LayoutWithNav from "../components/layout_with_nav";
import TeamReviews from "../components/content/team/reviews/TeamReviews";

export default function TeamPrs() {
  return (
    <Layout>
      <LayoutWithNav>
        <TeamReviews />
      </LayoutWithNav>
    </Layout>
  );
}
