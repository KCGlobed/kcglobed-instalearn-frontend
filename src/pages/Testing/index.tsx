import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchHomepageCategories } from "../../store/slices/homepageCategorySlice";

const Testing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.homepageCategory);

  useEffect(() => {
    dispatch(fetchHomepageCategories());
  }, [dispatch]);

  if (loading) return <p>Loading categories…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Homepage Categories</h1>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              <strong>{cat.name}</strong> — {cat.total_courses} courses
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Testing;