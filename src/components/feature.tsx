type FeatureProps = {
  title: string;
  description: string;
  image_src: string;
  flip: boolean;
};

const Feature = ({ title, description, image_src, flip }: FeatureProps) => {
  if (flip) {
    return (
      <div id="container">
        <div id="first_section">
          <img src={image_src}></img>
        </div>
        <div id="second_section">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div id="container">
        <div id="second_section">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div id="first_section">
          <img src={image_src}></img>
        </div>
      </div>
    );
  }
};

export default Feature;
