export const preventOverscrollRefresh = () => {
    if (!document.body.classList.contains('prevent-scroll-refresh')) {
        document.body.classList.add('prevent-scroll-refresh');
    }
}