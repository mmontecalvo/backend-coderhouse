const changeRolePremium = (button) => {
    const userId = button.getAttribute('data-id');

    fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(`Usuario con el id: ${userId} ahora es usuario PREMIUM.`);
        window.location.reload();
    })
    .catch((err) => {
        console.log(err);
    });
};

const changeRoleUser = (button) => {
    const userId = button.getAttribute('data-id');

    fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(`Usuario con el id: ${userId} ahora es usuario común.`);
        window.location.reload();
    })
    .catch((err) => {
        console.log(err);
    });
};

const deleteUser = (button) => {
    const userId = button.getAttribute('data-id');
    console.log(userId)

    fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(`Usuario con el id: ${userId} se eliminó correctamente.`);
        window.location.reload();
    })
    .catch((err) => {
        console.log(err);
    });
};