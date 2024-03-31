function JobCard(props) {
  const { title, description } = props;
  return (
    <div class="card" style={{ width: "50rem" }}>
      <div class="card-header">Potential Career Path</div>
      <div class="card-body">
        <h5 class="card-title">{title}</h5>
        <p class="card-text">{description}</p>
        <button
          type="submit"
          style={{
            backgroundColor: "#FFD700",
            border: "none",
            color: "black",
          }}
          className="btn btn-primary"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}

export default JobCard;
