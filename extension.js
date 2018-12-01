const Lang       = imports.lang;
const St         = imports.gi.St;
const Mainloop   = imports.mainloop;
const Util       = imports.misc.util;
const GLib       = imports.gi.GLib;

const Main      = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const CheckBox  = imports.ui.checkBox.CheckBox;

const Gettext = imports.gettext;
const _ = Gettext.domain('nordvpn').gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const TerminalReader = Me.imports.utils.terminal_reader;

let CONNECTION_STATUS = false;

const NordVPN = Lang.Class({
    Name: 'NordVPN',
    Extends: PanelMenu.Button,

    destroy: function () {
        // Call parent
        this.parent();
    },

    _init: function() {
        this.parent(0.0, "NordVPN");

        let hbox = new St.BoxLayout({ style_class: 'panel-status-menu-box nordvpn-hbox' });
        this.icon = new St.Icon({ style_class: 'system-status-icon nordvpn-icon' });
        hbox.add_child(this.icon);

        this.actor.add_child(hbox);

        this._buildMenu();

        //this._updateTopbarLayout();

        //this._setupTimeout();
    },

    _buildMenu: function () {
        let that = this;

        /* This create the search entry, which is add to a menuItem.
            The searchEntry is connected to the function for research.
            The menu itself is connected to some shitty hack in order to
            grab the focus of the keyboard. */
        // that._entryItem = new PopupMenu.PopupBaseMenuItem({
        //     reactive: false,
        //     can_focus: false
        // });
        // that.searchEntry = new St.Entry({
        //     name: 'searchEntry',
        //     style_class: 'search-entry',
        //     can_focus: true,
        //     hint_text: _('Search locations'),
        //     track_hover: true
        // });
        //
        // that.searchEntry.get_clutter_text().connect(
        //     'text-changed',
        //     Lang.bind(that, that._onSearchTextChanged)
        // );
        //
        // that._entryItem.actor.add(that.searchEntry, { expand: true });
        //
        // that.menu.addMenuItem(that._entryItem);
        //
        // that.menu.connect('open-state-changed', Lang.bind(this, function(self, open){
        //     let a = Mainloop.timeout_add(50, Lang.bind(this, function() {
        //         if (open) {
        //             that.searchEntry.set_text('');
        //             global.stage.set_key_focus(that.searchEntry);
        //         }
        //         Mainloop.source_remove(a);
        //     }));
        // }));

        // Create menu sections for items
        // Favorites
        // that.favoritesSection = new PopupMenu.PopupMenuSection();
        //
        // that.scrollViewFavoritesMenuSection = new PopupMenu.PopupMenuSection();
        // let favoritesScrollView = new St.ScrollView({
        //     style_class: 'ci-location-menu-section',
        //     overlay_scrollbars: true
        // });
        // favoritesScrollView.add_actor(that.favoritesSection.actor);
        //
        // that.scrollViewFavoritesMenuSection.actor.add_actor(favoritesScrollView);
        //
        // that.menu.addMenuItem(that.scrollViewFavoritesMenuSection);

        // Locations
        // that.locationSection = new PopupMenu.PopupMenuSection();
        //
        // that.scrollViewMenuSection = new PopupMenu.PopupMenuSection();
        // let locationScrollView = new St.ScrollView({
        //     style_class: 'ci-location-menu-section',
        //     overlay_scrollbars: true
        // });
        // locationScrollView.add_actor(that.locationSection.actor);
        //
        // that.scrollViewMenuSection.actor.add_actor(locationScrollView);
        //
        // that.menu.addMenuItem(that.scrollViewMenuSection);

        // Add separator
        // that.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Connection switch
        that.connectionMenuItem = new PopupMenu.PopupSwitchMenuItem(
            _("Auto connect"), CONNECTION_STATUS, { reactive: true });
        that.connectionMenuItem.connect('toggled',
            Lang.bind(that, that._onConnectSwitch));
        that.menu.addMenuItem(that.connectionMenuItem);

    },

    _onSearchTextChanged: function() {
        let searchedText = this.searchEntry.get_text().toLowerCase();

    },

    _onConnectSwitch: function() {
        let that = this;
        CONNECTION_STATUS = this.connectionMenuItem.state;

        let tr = new TerminalReader('nordvpn status', function(cmd, success, result) {
            Main.notify(cmd);
        });
        tr.executeReader();

        if (CONNECTION_STATUS) {
            // Main.notify("Connecting");
            // that._connect();
        } else {
            // Main.notify("Disconnecting");
            // that._disconnect();
        }
    },

    _connect: function(country) {

    },

    _disconnect: function() {
        let that = this;
        Main.notify(that._callProcess("nordvpn disconnect"));
    },

    _status: function(part) {
        let that = this;
        let status = that._callProcess("nordvpn status");

        status.forEach(function(statusLine) {
            let [label, value] = statusLine.split(": ");
        });
    },

    _callProcess: function(command) {
        return GLib.spawn_command_line_async(command)[1].toString();
    },
});


function init () {
    let localeDir = Me.dir.get_child('locale');
    Gettext.bindtextdomain('nordvpn', localeDir.get_path());
}

let nordvpn;
function enable () {
    nordvpn = new NordVPN();
    Main.panel.addToStatusArea('nordvpn', nordvpn, 1);
}

function disable () {
    nordvpn.destroy();
}
