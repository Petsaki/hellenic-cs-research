const colorMap = new Map<
    string,
    { borderColor: string; backgroundColor: string }
>();

colorMap.set('Assistant Professor', {
    borderColor: `rgba(31, 119, 180,1)`,
    backgroundColor: `rgba(31, 119, 180, opacity)`,
});

colorMap.set('Associate Professor', {
    borderColor: `rgba(148, 103, 189,1)`,
    backgroundColor: `rgba(148, 103, 189, opacity)`,
});

colorMap.set('Lab Lecturer', {
    borderColor: `rgba(255, 127, 14,1)`,
    backgroundColor: `rgba(255, 127, 14, opacity)`,
});

colorMap.set('Professor', {
    borderColor: `rgba(214, 39, 40,1)`,
    backgroundColor: `rgba(214, 39, 40, opacity)`,
});

colorMap.set('Lecturer', {
    borderColor: `rgba(44, 160, 44,1)`,
    backgroundColor: `rgba(44, 160, 44, opacity)`,
});

colorMap.set('Former', {
    borderColor: `rgba(128, 128, 128, 1)`, // Gray
    backgroundColor: `rgba(128, 128, 128, opacity)`,
});

export default colorMap;
