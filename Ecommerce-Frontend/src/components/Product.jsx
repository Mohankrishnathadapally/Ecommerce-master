import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const { id } = useParams();
  const {
    addToCart,
    removeFromCart,
    refreshData,
    getProductQuantity,
  } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(product);
      toast.success("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  const stockUnavailable =
    !product.productAvailable || product.stockQuantity <= 0;
  const cartQuantity = getProductQuantity(product.id);
  const reachedStockLimit = cartQuantity >= product.stockQuantity;

  return (
    <>
      <div className="containers" style={{ display: "flex" }}>
        <img
          className="left-column-img"
          src={imageUrl}
          alt={product.imageName}
          style={{ width: "50%", height: "auto" }}
        />

        <div className="right-column" style={{ width: "50%" }}>
          <div className="product-description">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "lighter" }}>
                {product.category}
              </span>
              <h6>
                Listed :{" "}
                <span>
                  <i>
                    {new Date(product.releaseDate).toLocaleDateString()}
                  </i>
                </span>
              </h6>
            </div>

            <h1
              style={{
                fontSize: "2rem",
                marginBottom: "0.5rem",
                textTransform: "capitalize",
                letterSpacing: "1px",
              }}
            >
              {product.name}
            </h1>
            <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                margin: "10px 0px 0px",
              }}
            >
              PRODUCT DESCRIPTION :
            </p>
            <p style={{ marginBottom: "1rem" }}>{product.description}</p>
          </div>

          <div className="product-price">
            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {"$" + product.price}
            </span>

            {cartQuantity === 0 ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (stockUnavailable) {
                    toast.warn("Product is out of stock");
                    return;
                  }
                  addToCart(product);
                  toast.success("Product added to cart");
                }}
                disabled={stockUnavailable}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  backgroundColor: stockUnavailable ? "#dc3545" : "#007bff", // red if out of stock
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: stockUnavailable ? "not-allowed" : "pointer",
                  marginTop: "15px",
                }}
              >
                {stockUnavailable ? "Out of Stock" : "Add to Cart"}
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "15px",
                  marginTop: "15px",
                }}
              >
                <button
                  className="btn btn-outline-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromCart(product);
                  }}
                >
                  -
                </button>
                <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  {cartQuantity}
                </span>
                <button
                  className="btn btn-outline-success"
                  onClick={(e) => {
                    e.preventDefault();
                    if (reachedStockLimit) {
                      toast.warning("Cannot add more. Stock limit reached");
                      return;
                    }
                    addToCart(product);
                  }}
                  disabled={stockUnavailable || reachedStockLimit}
                >
                  +
                </button>
              </div>
            )}

            <h6 style={{ marginBottom: "1rem" }}>
              Stock Available :{" "}
              <i
                style={{
                  color: product.stockQuantity > 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {product.stockQuantity}
              </i>
            </h6>
          </div>

          <div
            className="update-button"
            style={{ display: "flex", gap: "1rem" }}
          >
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleEditClick}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
              }}
            >
              Update
            </button>

            <button
              className="btn btn-danger"
              type="button"
              onClick={deleteProduct}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
