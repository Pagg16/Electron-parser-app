import {
  setError,
  setLoadBaseClass,
  setLoadingBaseClass,
} from "./getBaseClassSlise";

export const fetchGetBaseClass = (url) => async (dispatch) => {
  try {
    dispatch(setLoadingBaseClass(true));

    window.electron.getBaseClassCommentStart();

    window.electron.getBaseClassComment((data) => {
      dispatch(setLoadBaseClass(data)); // Сохраняем данные карточки
      dispatch(setLoadingBaseClass(false));
    });
    
  } catch (error) {
    dispatch(setLoadingBaseClass(false));
    dispatch(setError(error.message)); // Обрабатываем ошибку
  }
};
