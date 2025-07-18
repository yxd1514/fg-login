
export default {
  isAndroid() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('android');
  }
}