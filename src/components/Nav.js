import React from "react";
import ReactDOM from "react-dom";

const Header = () => {
  const style = {
    backgroundColor: "hsl(0 0% 94%)",
    margin: 0,
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirecton: "column",
  };
  return <h1 style={style}>&#x1F4F8; Photo Gallery Album</h1>;
};

const Photo = (props) => {
  const thumbnailStyle = {
    cursor: "zoom-in",
    display: "block",
    height: "120px",
    padding: "0 0 20px 20px",
    width: "180px",
  };
  const fullScreenStyle = {
    bottom: 0,
    cursor: "zoom-out",
    left: 0,
    margin: "auto",
    position: "fixed",
    right: 0,
    top: 0,
    width: "80vw",
    zIndex: 10,
  };
  const id = props.image.id;
  const src = `https://picsum.photos/1000?image=${id}`;
  return (
    <img
      key={id}
      onClick={() => props.handleClick(id)}
      src={src}
      style={props.isActive ? fullScreenStyle : thumbnailStyle}
    />
  );
};

Photo.defaultProps = { isActive: false };

const Frame = () => {
  const style = {
    backgroundColor: "hsla(0, 0%, 100%, 0.9)",
    bottom: 0,
    left: 0,
    margin: "auto",
    position: "fixed",
    right: 0,
    top: 0,
    zIndex: 5,
  };
  return <div style={style} />;
};

class TileView extends React.Component {
  style = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 20px 0 0",
  };

  constructor(props) {
    super(props);
    this.state = { activePhotoId: null };
    this.handlePhotoClick.bind(this);
  }

  handlePhotoClick = (clickedPhotoId) => {
    this.setState({
      activePhotoId:
        this.state.activePhotoId === clickedPhotoId ? null : clickedPhotoId,
    });
  };

  render() {
    const photos = this.props.images.map((image) => (
      <Photo
        image={image}
        isActive={this.state.activePhotoId === image.id}
        handleClick={this.handlePhotoClick}
      />
    ));
    return (
      <div>
        <div style={this.style}>{photos}</div>
        {this.state.activePhotoId !== null && <Frame />}
      </div>
    );
  }
}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  didFetchComplete = false;

  componentDidMount = () => {
    fetch("https://picsum.photos/list").then((response) => {
      this.didFetchComplete = true;
      if (response.ok) {
        response.json().then((data) => {
          this.setState({ images: data.slice(0, 20) });
        });
      } else {
        this.setState({ images: [] });
      }
    });
  };

  render() {
    let content;
    if (this.didFetchComplete) {
      if (this.state.images.length > 0) {
        content = <TileView images={this.state.images} />;
      } else {
        content = (
          <p style={{ paddingLeft: "20px" }}>
            Whoops! We couldn't find any photos to display.
          </p>
        );
      }
    }
    return (
      <div>
        <Header />
        {content}
      </div>
    );
  }
}

ReactDOM.render(<Nav />, document.getElementById("root"));
export default Nav;
