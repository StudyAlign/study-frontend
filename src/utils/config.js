export const preventOverscrollRefresh = () => {
    if (!document.body.classList.contains('prevent-scroll-refresh') || !document.documentElement.classList.contains('prevent-scroll-refresh')) {
        document.documentElement.classList.add('prevent-scroll-refresh');
        document.body.classList.add('prevent-scroll-refresh');
    }
}