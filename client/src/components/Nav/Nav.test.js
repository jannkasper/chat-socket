import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Nav from '.';
import mock$ from 'jquery';

describe('test', () => {
    let mockTooltip, mockCollapse;

    const mockTranslations = {
        newRoomButton: 'New room',
        settingsButton: 'Settings',
        aboutButton: 'About',
    };

    beforeEach(() => {
        mockTooltip = jest.fn().mockImplementation(param => {
            console.log('tooltip', param);
        });

        mockCollapse = jest.fn().mockImplementation(param => {
            console.log('collapse', param);
        });

        jest.mock('jquery', () => {
            return jest.fn().mockImplementation(param => {
                // console.log('$', param);
                if (typeof param === 'function') {
                    param();
                }
                return {
                    tooltip: mockTooltip,
                    collapse: mockCollapse,
                };
            });
        });

        jest.mock('shortid', () => {
            return {
                generate() {
                    return 'fakeid';
                },
            };
        });

        jest.useFakeTimers();
    })

    test('Nav component is displaying', async () => {
        const { asFragment } = render(
            <Nav
                members={[]}
                roomId={'testRoom'}
                userId={'userId__'}
                roomLocked={false}
                toggleLockRoom={() => {}}
                openModal={() => {}}
                iAmOwner={true}
                translations={{}}
            />,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    test('Can copy room url', async () => {
        document.execCommand = jest.fn(() => true);

        const toggleLockRoom = jest.fn();

        const { getByText } = render(
            <Nav
                members={[
                    { id: 'id1', username: 'alan', isOwner: true },
                    { id: 'id2', username: 'dan', isOwner: false },
                ]}
                roomId={'testRoom'}
                userId={'userId'}
                roomLocked={true}
                toggleLockRoom={toggleLockRoom}
                openModal={() => {}}
                iAmOwner={false}
                translations={{}}
            />,
        );

        fireEvent.click(getByText(`/testRoom`));

        expect(document.execCommand).toHaveBeenLastCalledWith('copy');
        expect(mock$).toHaveBeenCalledTimes(15);
        expect(mockTooltip).toHaveBeenLastCalledWith('show');

        // Wait tooltip closing
        jest.runAllTimers();

        expect(mock$).toHaveBeenCalledTimes(18);
        expect(mockTooltip).toHaveBeenLastCalledWith('hide');
    });

    test('Can lock/unlock room is room owner only', async () => {
        const toggleLockRoom = jest.fn();

        const { rerender, getByTitle } = render(
            <Nav
                members={[
                    { id: 'id1', username: 'alan', isOwner: true },
                    { id: 'id2', username: 'dan', isOwner: false },
                ]}
                roomId={'testRoom'}
                userId={'userId'}
                roomLocked={true}
                toggleLockRoom={toggleLockRoom}
                openModal={() => {}}
                iAmOwner={true}
                translations={{}}
            />,
        );

        const toggleLockRoomButton = getByTitle('You must be the owner to lock or unlock the room');

        fireEvent.click(toggleLockRoomButton);

        expect(toggleLockRoom).toHaveBeenCalledWith();

        fireEvent.click(toggleLockRoomButton);

        expect(toggleLockRoom).toHaveBeenCalledTimes(2);

        // We are not the room owner anymore
        rerender(
            <Nav
                members={[
                    { id: 'id1', username: 'alan', isOwner: true },
                    { id: 'id2', username: 'dan', isOwner: false },
                ]}
                roomId={'testRoom'}
                userId={'userId'}
                roomLocked={true}
                toggleLockRoom={toggleLockRoom}
                openModal={() => {}}
                iAmOwner={false}
                translations={{}}
            />,
        );

        fireEvent.click(toggleLockRoomButton);

        expect(toggleLockRoom).toHaveBeenCalledTimes(2);
        expect(mock$).toHaveBeenLastCalledWith('.lock-room');
        expect(mockTooltip).toHaveBeenLastCalledWith('show');
    });

    test('Can show user list', async () => {
        // Test with one user owner and me
        const { getByTitle, getByText, queryByTitle, rerender } = render(
            <Nav
                members={[{ id: 'id1', username: 'alan', isOwner: true }]}
                roomId={'testRoom'}
                userId={'id1'}
                roomLocked={true}
                toggleLockRoom={() => {}}
                openModal={() => {}}
                iAmOwner={true}
                translations={{}}
            />,
        );

        fireEvent.click(getByTitle('Users'));

        await waitFor(() => expect(getByText('alan')).toBeInTheDocument());
        await waitFor(() => expect(getByTitle('Owner')).toBeInTheDocument());
        await waitFor(() => expect(getByTitle('Me')).toBeInTheDocument());

        // Test with two user not owner, not me
        rerender(
            <Nav
                members={[
                    { id: 'id1', username: 'alan', isOwner: false },
                    { id: 'id2', username: 'dan', isOwner: false },
                ]}
                roomId={'testRoom'}
                userId={'otherId'}
                roomLocked={true}
                toggleLockRoom={() => {}}
                openModal={() => {}}
                iAmOwner={true}
                translations={{}}
            />,
        );
        await waitFor(() => expect(getByText('alan')).toBeInTheDocument());
        await waitFor(() => expect(getByText('dan')).toBeInTheDocument());
        expect(queryByTitle('Owner')).not.toBeInTheDocument();
        expect(queryByTitle('Me')).not.toBeInTheDocument();
    });

    test('Can open settings', async () => {
        const openModal = jest.fn();

        // Test with one user owner and me
        const { getByText } = render(
            <Nav
                members={[]}
                roomId={'testRoom'}
                userId={'id1'}
                roomLocked={true}
                toggleLockRoom={() => {}}
                openModal={openModal}
                iAmOwner={true}
                translations={mockTranslations}
            />,
        );

        fireEvent.click(getByText(mockTranslations.settingsButton));

        expect(mock$).toHaveBeenLastCalledWith('.navbar-collapse');
        expect(mockCollapse).toHaveBeenLastCalledWith('hide');
        expect(openModal).toHaveBeenLastCalledWith('Settings');
    });
})
