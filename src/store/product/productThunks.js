import {
  setProductInfo,
  setComments,
  setLoadingComments,
  setLoadingProductInfo,
  setError,
} from "./productSlice";

export const fetchProductData = (url) => async (dispatch) => {
  try {
    dispatch(setLoadingProductInfo(true));
    dispatch(setLoadingComments(true));

    // Запускаем асинхронную задачу на получение данных
    window.electron.parseStart(url);

    // Получаем информацию о продукте и комментариях
    window.electron.getProductInform((data) => {
      dispatch(setProductInfo(data)); // Сохраняем данные карточки
      dispatch(setLoadingProductInfo(false));
    });

    window.electron.getProductComment((data) => {
      dispatch(setComments(data)); // Сохраняем комментарии
      dispatch(setLoadingComments(false));
    });
  } catch (error) {
    dispatch(setLoadingComments(false));
    dispatch(setError(error.message)); // Обрабатываем ошибку
  }
};
