**To Execute:**  
-Run npm install.  
-Run the app with npm run dev.  

**Short Brief**
SPA, Responsive, flex and smooth UI, using React and Typescript for exploring, creating and searching cocktails in a dynamic-responsive scrolling behaviour.
  
**Architectural Decisions**  
**-FSD:**  
A common and scalable approach that isolates feature components from shared components (reusable across multiple features).  
**-Smart Routes:**  
For supporting future route based components and better scalability.  
**-Virtualization:**  
Using React-Virtual lib to achieve Horizontal and Vertical virtualizations, Handling heavy items.  
**-React Hook Form:**  
For a more maintainable and performant form experience with built-in validation.  
**-CSS Modules:**  
For scoped, maintainable styling.  
**-TypeScript:**  
For strong type safety and consistency between client and server models.  
**-Error Handling:**  
ErrorBoundary for rendering faults fallbacks.  
Local: try/catch state  
**-Context-Api:**  
For handling theme contexts and other light weight non-frequent updated features.  
**-Vite:**  
For configuration simplicity, fast dev server and modern codebase.  
  
**React Patterns used in this app:**  
**-Custom Hooks**  
**-Compounds**  
**-Feature and Reusable components**  
**-Layout Pattern** with one parent for both child to reduce loading times on unmount and hold the shared data in parent
