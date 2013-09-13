Vagrant.configure("2") do |config|
    config.vm.box = 'raspbian-wheezy'
    config.vm.box_url = 'https://dl.dropboxusercontent.com/u/3428571/Debian-7.1.0-i386.box'
    config.vm.hostname = "float-it.com"
    config.vm.network :private_network, ip: "10.11.12.20"
    config.vm.synced_folder ".", "/home/vagrant/project"#, :nfs => true
    config.vm.synced_folder "salt/", "/srv/"

    config.vm.provision :salt do |s|
        s.minion_config = "salt/minion"
        #s.verbose = true
        s.run_highstate = true
    end
end
