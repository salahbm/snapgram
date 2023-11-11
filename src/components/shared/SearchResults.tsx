import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsType = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document | undefined;
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
