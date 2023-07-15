function Footer() {
  return (
    <div className="p-2 text-center text-xs text-base-content/50">
      <p>
        Copyright © {new Date().getFullYear()} -{" "}
        <a
          className="font-bold"
          href="https://github.com/Stuckinendlesschaos/upscayl"
          target="_blank">
           剪佳
        </a>
      </p>
      <p>
        By shichangchun and sukai
      </p>
    </div>
  );
}

export default Footer;
