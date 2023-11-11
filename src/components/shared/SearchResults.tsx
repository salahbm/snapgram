import GridPostList from "./GridPostList";
import Loader from "./Loader";

type SearchResultsType = {
  isSearchFetching: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchedPosts: any;
};
const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultsType) => {
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }
  return (
    <p className="text-light-4 mt-4 text-center">{"No Result Found :(  "} </p>
  );
};

export default SearchResults;
