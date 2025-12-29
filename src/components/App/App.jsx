import ProductInformation from "../ProductInformation/ProductInformation";
import ProductReviews from "../ProductReviews/ProductReviews";
import ReviewChartRating from "../ReviewChartRating/ReviewChartRating";
import ReviewChartRatingQuantity from "../ReviewChartRatingQuantity/ReviewChartRatingQuantity";
import SimilarProducts from "../ProductReviewsSorted/ProductReviewsSorted";
import WindowHeader from "../WindowHeader/WindowHeader";
import styles from "./App.module.scss";
import ReviewCharWords from "../ReviewCharWords/ReviewCharWords";
import LoaderForElement from "../LoaderForElement/LoaderForElement";
import { useSelector } from "react-redux";

function App() {
  const { isLoadingBaseClass } = useSelector((state) => state.getBaseClass);

  return (
    <div className={styles.app}>
      <WindowHeader />
      <div className={styles.main}>
        {isLoadingBaseClass && (
          <div className={styles.mainLoadingBaseClass}>
            <p className={styles.mainLoadingBaseClassTitle}>
              Обновление данных поиска
            </p>
            <LoaderForElement />
          </div>
        )}
        <ProductInformation />
        <ProductReviews />
        <SimilarProducts />
        <ReviewChartRatingQuantity />
        <ReviewChartRating />
        <div className={styles.mainGridElem}>
          <ReviewCharWords />
        </div>
      </div>
    </div>
  );
}

export default App;
