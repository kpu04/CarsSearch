
const saveToLocalStorage = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('cart', serializedState);
    } catch (e) {
      console.warn(e);
    }
  };
  
  const loadFromLocalStorage = () => {
    try {
      const serializedState = localStorage.getItem('cart');
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    } catch (e) {
      console.warn(e);
      return undefined;
    }
  };
  
  const cartMiddleware = (store) => (next) => (action) => {
    const result = next(action); 
    saveToLocalStorage(store.getState()); 
    return result;
  };

  const authorize = (roles = []) => {
    return (req, res, next) => {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: "Токен не предоставлен" });
      }
  
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: "Недействительный токен" });
        }
  
        req.user = decoded; 
        if (roles.length && !roles.includes(decoded.role)) {
          return res.status(403).json({ error: "Доступ запрещен" });
        }
  
        next();
      });
    };
  };

  // const authoMiddleware = (store) => (next) => (action) => {
  //   const result = next(action); 
  //   saveToLocalStorage(store.getState()); 
  //   return result;
  // };
  
  export { loadFromLocalStorage, cartMiddleware, authorize };