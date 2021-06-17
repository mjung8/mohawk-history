window.addEventListener('load', () => {

  console.log("data for '" + myHistory.studentName + "' loaded!");

  // cache global elements
  const firstSectionTitle = "Introduction";
  const mainContentElement = document.getElementById("main-content");
  const sidebarMenuWrapperElement = document.getElementById("sidebarMenuWrapper");

  // functions to create elements
  const summaryInfoCreation = () => {
    // summary info
    let sectionElement = sectionCreation(firstSectionTitle);
    let mainHeadingElement = headingCreation(myHistory.schoolName + " - " + myHistory.program, "h2");
    let subHeadingElement = headingCreation(myHistory.heading, "h3");

    sectionElement.append(mainHeadingElement);
    mainContentElement.append(sectionElement);
    mainHeadingElement.after(subHeadingElement);

    let summaryElement = document.createElement("p");
    summaryElement.innerHTML = myHistory.summary;
    subHeadingElement.after(summaryElement);

    document.getElementById("bannerText").append(" for " + myHistory.studentName);
  };

  const sectionCreation = (id) => {
    let sectionElement = document.createElement("section");
    sectionElement.id = id;

    return sectionElement;
  };

  const headingCreation = (id, type) => {
    let mainHeadingElement = document.createElement(type);
    mainHeadingElement.append(id);

    return mainHeadingElement;
  };

  const sideBarCreation = () => {
    let anchorElement = document.createElement("a");
    anchorElement.href = "#" + firstSectionTitle;
    anchorElement.append(firstSectionTitle);
    let listElement = document.createElement("li");
    listElement.append(anchorElement);

    sidebarMenuWrapperElement.append(listElement);

    // semesters
    myHistory.studentData.forEach(s => {
      let anchorElement = document.createElement("a");
      let semesterId = "semester-" + s.semester;
      anchorElement.href = "#" + semesterId;
      anchorElement.append("Semester " + s.semester);

      let listElement = document.createElement("li");
      listElement.append(anchorElement);

      sidebarMenuWrapperElement.append(listElement);

      // semesters need child ul for courses
      let ul = document.createElement("ul");
      ul.className = "navbar-nav";
      listElement.append(ul);

      s.courses.forEach((c, i) => {
        let anchorElement = document.createElement("a");
        let courseId = semesterId + "-course-" + (i + 1);
        anchorElement.href = "#" + courseId;
        anchorElement.append(c.name);

        let listElement = document.createElement("li");
        listElement.append(anchorElement);

        ul.append(listElement);
      });
    });
  };

  const contentCreation = () => {
    myHistory.studentData.forEach(s => {
      let semesterId = "semester-" + s.semester;
      let sectionElement = sectionCreation(semesterId);
      sectionElement.className = "section-semester";
      let subHeadingElement = headingCreation("Semester " + s.semester, "h3");

      sectionElement.append(subHeadingElement);
      mainContentElement.append(sectionElement);

      let summaryElement = document.createElement("p");
      summaryElement.innerHTML = s.semesterSummary + "<br /><br />" + "Semester GPA: " + s.GPA;
      subHeadingElement.after(summaryElement);

      s.courses.forEach((c, i) => {
        let courseId = semesterId + "-course-" + (i + 1);
        let subSectionElement = sectionCreation(courseId);
        subSectionElement.className = "section-course";
        let subHeadingElement = headingCreation(c.name, "h4");

        subSectionElement.append(subHeadingElement);
        sectionElement.append(subSectionElement);

        let summaryElement = document.createElement("p");
        summaryElement.innerHTML = c.courseSummary + "<br /><br />" + "Grade: " + c.grade;
        subHeadingElement.after(summaryElement);

        if (c.highlights.length > 0) {
          let highlightsHeading = headingCreation("Highlights", "h5");
          highlightsHeading.className = "highlights";
          subSectionElement.append(highlightsHeading);

          c.highlights.forEach(m => {
            let heading = headingCreation(m.name, "h6");          
            subSectionElement.append(heading);

            let infoElement = document.createElement("p");
            infoElement.append(m.description);
            subSectionElement.append(infoElement);

            if (m.externalLink.length > 0) {
              let anchor = document.createElement("a");
              anchor.href = m.externalLink;
              anchor.className = "externalLink";
              anchor.target = "_blank";
              anchor.append(m.externalLinkInfo);
              subSectionElement.append(anchor);
            }

            if (m.imageUrl.length > 0) {
              let image = document.createElement("img");
              image.src = m.imageUrl;
              image.className = "img-fluid";
              subSectionElement.append(image);
            }

          });
        }
      });
    });
  };

  const gradesSectionCreation = () => {
    let titleId = "Grades";
    let title = "Grades Summary";
    let anchorElement = document.createElement("a");
    anchorElement.href = "#" + titleId;
    anchorElement.append(title);
    let listElement = document.createElement("li");
    listElement.append(anchorElement);

    sidebarMenuWrapperElement.append(listElement);

    let sectionElement = sectionCreation(titleId);
    sectionElement.className = "section-semester";
    let subHeadingElement = headingCreation(title, "h3");

    sectionElement.append(subHeadingElement);

    let summaryElement = document.createElement("p");
    summaryElement.innerHTML = "Overall GPA: " + myHistory.studentGPA;
    subHeadingElement.after(summaryElement);

    let image = document.createElement("img");
    image.src = myHistory.gradesSummaryLink;
    image.className = "img-fluid";
    summaryElement.after(image);

    mainContentElement.append(sectionElement);
  };

  // put stuff together
  summaryInfoCreation();
  sideBarCreation();
  contentCreation();
  gradesSectionCreation();

  /**
   *  From https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/
   */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.intersectionRatio > 0) {
        document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active');
      } else {
        document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('active');
      }
    });
  });


  document.addEventListener("wheel", () => {
    console.log("i scrolled");
  });

  // Track all sections that have an `id` applied
  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section);
  });

});