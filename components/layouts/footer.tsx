
const Footer = () => {
    return (
        <div className="p-6 pt-0 mt-auto text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
            © {new Date().getFullYear()}. {process.env.APP_NAME} | Todos los derechos reservados.
        </div>
    );
};

export default Footer;
